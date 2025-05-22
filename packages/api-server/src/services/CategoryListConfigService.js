import CategoryListConfig from '../models/Components/CategoryListConfig.js';


class CategoryListConfigService {
  async getByStore(storeId) {
    return CategoryListConfig.find({ store: storeId });
  }

  async getById(id) {
    return CategoryListConfig.findById(id);
  }

  async create(data) {
    return CategoryListConfig.create(data);
  }

  async update(id, data) {
    return CategoryListConfig.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id) {
    return CategoryListConfig.findByIdAndDelete(id);
  }
}

export default new CategoryListConfigService();