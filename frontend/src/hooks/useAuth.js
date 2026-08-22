import { authService } from '../services/authService';

export function useAuth() {
  return {
    user: authService.getCurrentUser(),
  };
}
