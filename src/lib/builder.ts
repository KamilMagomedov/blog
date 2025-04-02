import { IGetPostQueryBuilder } from "@/types/Posts";

export const getPostQueryBuilder = (): IGetPostQueryBuilder => {
  class Builder implements IGetPostQueryBuilder {
    page: string | undefined;
    search: string | null | undefined;
    limit: number | null;
    type: string | null;
    category: string | null;
    tags: string | null | undefined;
    order: string | null;
    dir: string | null;
    archive: string | undefined | null;

    constructor(page = "1") {
      this.page = page;
      this.search = null;
      this.limit = null;
      this.type = null;
      this.category = null;
      this.tags = null;
      this.order = null;
      this.dir = null;
      this.archive = null;
    }

    setPage(param: string | undefined): this {
      this.page = param || "1";
      return this;
    }

    setSearch(param: string | null | undefined): this {
      this.search = param || null;
      return this;
    }

    setLimit(param: number | null): this {
      this.limit = param;
      return this;
    }

    setType(param: string | null): this {
      this.type = param;
      return this;
    }

    setCategory(param: string | null): this {
      this.category = param;
      return this;
    }

    setTags(param: string | null | undefined): this {
      this.tags = param || null;
      return this;
    }

    setOrder(param: string | null): this {
      this.order = param;
      return this;
    }

    setDir(param: string | null): this {
      this.dir = param;
      return this;
    }

    setArchive(date: string | undefined | null): this {
      this.archive = date || null;
      return this;
    }

    build(): string {
      const params: Record<string, string | number | undefined | null> = {
        page: this.page,
        search: this.search,
        limit: this.limit,
        type: this.type,
        category: this.category,
        tags: this.tags,
        order: this.order,
        dir: this.dir,
        archive: this.archive,
      };

      return Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    }
  }

  return new Builder();
};
