import ProductGridConfig from '../models/Components/ProductGridConfig.js';

class ProductGridConfigService {
  async getByStore(storeId) {
    return ProductGridConfig.find({ store: storeId });
  }

  async getById(id) {
    return ProductGridConfig.findById(id);
  }

  async create(data) {
    return ProductGridConfig.create(data);
  }

  async update(id, data) {
    return ProductGridConfig.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id) {
    return ProductGridConfig.findByIdAndDelete(id);
  }
}

export default new ProductGridConfigService();