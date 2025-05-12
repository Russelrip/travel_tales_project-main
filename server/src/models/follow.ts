export interface Follow {
    id: number;
    followerId: number;
    followingId: number;
    isFollowing: boolean;
    createdAt: Date;
}