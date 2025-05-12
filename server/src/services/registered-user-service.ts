import { CreateUserDTO, RegisteredUser, UserProfileDTO } from "../models/registered-user";
import { BlogPostRepository } from "../repositories/blog-post-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { FollowRepository } from "../repositories/follow-repository";
import { LikeRepository } from "../repositories/like-repository";
import { RegisteredUserRepository } from "../repositories/registered-user-repository";
import { generateAccessToken, generateRefreshToken, generateToken } from "../utils/jwt-utils";
import { comparePassword, hashPassword } from "../utils/password-utils";

export class RegisteredUserService {
    private readonly registeredUserRepository: RegisteredUserRepository = new RegisteredUserRepository();

    async loginUser(email: string, password: string): Promise<{ id: number, username: string, email: string, accessToken: string; refreshToken: string }> {
        const user = await this.registeredUserRepository.findByEmail(email);
        if (!user) throw new Error('User not found');

        const isValid = await comparePassword(password, user.passwordSalt, user.passwordHash);
        if (!isValid) throw new Error('Invalid credentials');

        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken,
            refreshToken
        };
    }


    async registerUser(data: CreateUserDTO): Promise<{ id: number, username: string, email: string, accessToken: string; refreshToken: string }> {
        const existing = await this.registeredUserRepository.findByEmail(data.email);
        if (existing) throw new Error('Email already in use');

        const { passwordHash, passwordSalt } = await hashPassword(data.password);

        const user = await this.registeredUserRepository.create({
            username: data.username,
            email: data.email,
            passwordHash,
            passwordSalt
        });

        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken,
            refreshToken
        };
    }

    // Get User Profile
    // Username, Date of Joining, All Posts, Total Number of Posts, Follower Count, Following Count.
    async getUserProfile(profileUserId: number, currentUserId: number): Promise<UserProfileDTO> {
        try {
            const user = await this.registeredUserRepository.getById(profileUserId);
            if (!user) {
                throw new Error('User not found');
            }

            const blogPostRepository = new BlogPostRepository();
            const followRepository = new FollowRepository();
            const likeRepository = new LikeRepository();
            const commentRepository = new CommentRepository();

            // Get posts written by this user
            const posts = await blogPostRepository.findMany({
                where: {
                    authorId: profileUserId
                }
            });

            // Compose posts into BlogPostWithDetailsDTO[]
            const postDTOs = await Promise.all(
                posts.map(async (post) => {
                    const likeCount = await likeRepository.countLikes(post.id);
                    const didUserLikeThis = false;
                    const isUserFollowingAuthor = false; // not relevant for own profile

                    const commentsList = await commentRepository.findMany({
                        where: { blogPostId: post.id }
                    });

                    const comments = await Promise.all(
                        commentsList.map(async (comment) => {
                            const commentUser = await this.registeredUserRepository.findSingle({
                                where: { id: comment.registeredUserId }
                            });

                            return {
                                id: comment.id,
                                username: commentUser?.username ?? '',
                                dateWritten: comment.createdAt,
                                commentContent: comment.comment,
                                isUserOwned: comment.registeredUserId === currentUserId
                            };
                        })
                    );

                    return {
                        id: post.id,
                        authorUsername: user.username,
                        title: post.title,
                        dateOfVisit: post.dateOfVisit,
                        likeCount,
                        countryName: post.countryName,
                        content: post.content,
                        dateBlogWasCreated: post.createdAt,
                        listOfComments: comments,
                        didUserLikeThis,
                        isUserFollowingAuthor,
                    };
                })
            );

            // Follower and Following counts
            const followerCount = (await followRepository.findMany({
                where: {
                    followingId: profileUserId,
                    isFollowing: true
                }
            })).length;

            const followingCount = (await followRepository.findMany({
                where: {
                    followerId: profileUserId,
                    isFollowing: true
                }
            })).length;

            return {
                username: user.username,
                email: user.email,
                dateOfJoining: user.createdAt,
                totalPosts: posts.length,
                followerCount,
                followingCount,
                posts: postDTOs,
                isUserFollowing: currentUserId != profileUserId
                    ? await followRepository.isFollowing(currentUserId, profileUserId)
                    : false
            };
        } catch (error: any) {
            throw new Error(`Failed to get user profile: ${error.message}`);
        }
    }

    async getUserById(id: number): Promise<RegisteredUser | null> {
        try {
            return await this.registeredUserRepository.getById(id);
        } catch (error) {
            throw new Error('Failed to get user by ID.');
        }
    }

    async getAllUsers(): Promise<RegisteredUser[]> {
        return await this.registeredUserRepository.getAll();
    }

    async updateUser(id: number, data: Partial<Omit<RegisteredUser, 'id' | 'createdAt'>>): Promise<RegisteredUser> {
        return await this.registeredUserRepository.updateById(id, data);
    }

    async deleteUser(id: number): Promise<RegisteredUser> {
        return await this.registeredUserRepository.deleteById(id);
    }

    async getUserByUsername(username: string): Promise<RegisteredUser> {
        try {
            const user = await this.registeredUserRepository.findSingle({
                where: { username }
            });

            if (!user) {
                throw new Error(`User with username '${username}' not found.`);
            }

            return user;
        } catch (error: any) {
            throw new Error(`Failed to get user by username: ${error.message}`);
        }
    }

}