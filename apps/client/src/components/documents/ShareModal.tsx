import { useState } from 'react';
import { X, Users, UserPlus, Shield, Loader2, UserMinus } from 'lucide-react';
import { 
  useUsers, 
  usePermissions, 
  useShareDocument, 
  useUpdatePermission, 
  useRevokePermission 
} from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types/permission';

interface ShareModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ documentId, isOpen, onClose }: ShareModalProps) {
  const { user: currentUser } = useAuth();
  
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: permissions, isLoading: loadingPermissions } = usePermissions(documentId);
  
  const { mutate: shareDocument, isPending: sharing } = useShareDocument(documentId);
  const { mutate: updatePermission, isPending: updating } = useUpdatePermission(documentId);
  const { mutate: revokePermission, isPending: revoking } = useRevokePermission(documentId);

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('VIEWER');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedUserId) return;

    shareDocument(
      { userId: selectedUserId, role: selectedRole },
      {
        onSuccess: () => {
          setSelectedUserId('');
          setSelectedRole('VIEWER');
        },
        onError: (err: any) => {
          setError(err.response?.data?.error || 'Failed to share document.');
        },
      }
    );
  };

  const isWorking = sharing || updating || revoking;

  // Filter out the current user from the select list
  const shareableUsers = users?.filter(u => u.id !== currentUser?.id) || [];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-elevated p-6 shadow-xl border border-surface-border animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-500" />
            <h2 className="text-xl font-semibold text-text-primary">Share Document</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleShare} className="mb-6 flex gap-2">
          <div className="flex-1">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isWorking || loadingUsers}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
              required
            >
              <option value="" disabled>Select a user...</option>
              {shareableUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            disabled={isWorking}
            className="w-28 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
          >
            <option value="VIEWER">Viewer</option>
            <option value="EDITOR">Editor</option>
          </select>

          <button
            type="submit"
            disabled={!selectedUserId || isWorking}
            className="flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          </button>
        </form>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-text-secondary flex items-center gap-1.5 border-b border-surface-border pb-2">
            <Shield className="h-4 w-4" />
            People with access
          </h3>
          
          {loadingPermissions ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
            </div>
          ) : permissions?.length === 0 ? (
            <p className="text-sm text-text-muted italic py-2 text-center">
              This document hasn't been shared with anyone yet.
            </p>
          ) : (
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {permissions?.map(permission => {
                const user = users?.find(u => u.id === permission.userId);
                if (!user) return null;

                return (
                  <li key={permission.id} className="flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">{user.name}</span>
                      <span className="text-xs text-text-muted">{user.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <select
                        value={permission.role}
                        onChange={(e) => updatePermission({ userId: permission.userId, role: e.target.value as Role })}
                        disabled={isWorking}
                        className="rounded border border-transparent bg-surface-hover px-2 py-1 text-xs font-medium text-text-secondary hover:border-surface-border focus:outline-none disabled:opacity-50"
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="EDITOR">Editor</option>
                      </select>
                      
                      <button
                        onClick={() => revokePermission(permission.userId)}
                        disabled={isWorking}
                        className="rounded p-1 text-text-muted hover:bg-danger/10 hover:text-danger transition-colors disabled:opacity-50"
                        title="Remove access"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
