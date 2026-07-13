import { PAGINATION } from "./constants.js";

export const getPaginationParams = (query) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  let limit = parseInt(query.page_size, 10) || PAGINATION.DEFAULT_LIMIT;

  if (limit <= 0) {
    limit = PAGINATION.DEFAULT_LIMIT;
  } else if (limit > PAGINATION.MAX_LIMIT) {
    limit = PAGINATION.MAX_LIMIT;
  }

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const paginate = async (model, queryParams, prismaOptions = {}) => {
  const { page, limit, skip } = getPaginationParams(queryParams);

  const [total_items, data] = await Promise.all([
    model.count({ where: prismaOptions.where }),
    model.findMany({
      ...prismaOptions,
      skip,
      take: limit,
    }),
  ]);

  const total_pages = Math.ceil(total_items / limit);

  return {
    page,
    page_size: limit,
    total_items,
    total_pages,
    data,
  };
};
