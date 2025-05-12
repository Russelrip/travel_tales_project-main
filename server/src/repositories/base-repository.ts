export class BaseRepository<TModel extends { id: number }, TExclude extends keyof TModel = 'id'> {
    protected readonly model: any;

    constructor(model: any) {
        this.model = model;
    }

    async getById(id: number): Promise<TModel | null> {
        try {
            return await this.model.findUnique({ where: { id } });
        } catch (error: any) {
            throw new Error(`Failed to get record by ID: ${error.message}`);
        }
    }

    async getAll(): Promise<TModel[]> {
        try {
            return await this.model.findMany();
        } catch (error: any) {
            throw new Error(`Failed to get records: ${error.message}`);
        }
    }

    async deleteById(id: number): Promise<TModel> {
        try {
            return await this.model.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(`Failed to delete record: ${error.message}`);
        }
    }

    async create(data: Omit<TModel, TExclude>): Promise<TModel> {
        try {
            return await this.model.create({ data });
        } catch (error: any) {
            throw new Error(`Failed to create record: ${error.message}`);
        }
    }

    async updateById(id: number, data: Partial<Omit<TModel, TExclude>>): Promise<TModel> {
        try {
            return await this.model.update({
                where: { id },
                data
            });
        } catch (error: any) {
            throw new Error(`Failed to update record: ${error.message}`);
        }
    }

    async findSingle(args: any): Promise<TModel | null> {
        try {
            return await this.model.findFirst(args);
        } catch (error: any) {
            throw new Error(`Failed to find record: ${error.message}`);
        }
    }

    async findMany(args: any = {}): Promise<TModel[]> {
        try {
            return await this.model.findMany(args);
        } catch (error: any) {
            throw new Error(`Failed to get records: ${error.message}`);
        }
    }
}