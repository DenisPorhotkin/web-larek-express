export interface CreateProductDto {
    title: string;
    image: {
        fileName: string;
        originalName: string;
    };
    category: string;
    description?: string;
    price?: number | null;
}
