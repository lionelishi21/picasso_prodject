import ProductCardConfig from '../models/Components/ProductCardConfig.js';

class ProductCardConfigService {
  async getByStore(storeId) {
    return ProductCardConfig.find({ store: storeId });
  }

  async getById(id) {
    return ProductCardConfig.findById(id);
  }

  async create(data) {
    return ProductCardConfig.create(data);
  }

  async update(id, data) {
    return ProductCardConfig.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id) {
    return ProductCardConfig.findByIdAndDelete(id);
  }
}

export default new ProductCardConfigService();