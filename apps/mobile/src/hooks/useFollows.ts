import { useState, useCallback } from 'react';
import { followUser, unfollowUser, isFollowing } from '@fliqq/sdk';

export function useFollow(currentUserId: string | undefined, targetUserId: string | undefined) {
  const [following, setFollowing] = useState(false);
  const [toggling, setToggling] = useState(false);

  const check = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;
    setFollowing(await isFollowing(currentUserId, targetUserId));
  }, [currentUserId, targetUserId]);

  const toggle = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;
    setToggling(true);
    if (following) {
      await unfollowUser(currentUserId, targetUserId);
      setFollowing(false);
    } else {
      await followUser(currentUserId, targetUserId);
      setFollowing(true);
    }
    setToggling(false);
  }, [currentUserId, targetUserId, following]);

  return { following, toggling, toggle, check };
}

