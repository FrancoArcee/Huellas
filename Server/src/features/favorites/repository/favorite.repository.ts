import prisma from "../../../config/database";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const FavoriteRepository = {
  async findById(id: string) {
    return prisma.favorite.findUnique({
      where: { id },
      include: { post: true, user: true },
    });
  },

  async findByUserAndPost(userId: string, postId: string) {
    return prisma.favorite.findUnique({
      where: { postId_userId: { postId, userId } },
    });
  },

  async create(data: { postId: string; userId: string }) {
    return prisma.favorite.create({ data });
  },

  async delete(id: string): Promise<void> {
    await prisma.favorite.delete({ where: { id } });
  },

  async listByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<any>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        include: { post: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};
