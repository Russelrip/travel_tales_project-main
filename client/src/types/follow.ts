export interface FollowDTO {
    id: number;
    followerId: number;
    followingId: number;
    isFollowing: boolean;
    createdAt: string;      // ISO date string
}