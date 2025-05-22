import FooterConfig from '../models/Components/FooterConfig.js';

class FooterConfigService {
  async getByStore(storeId) {
    return FooterConfig.find({ store: storeId });
  }

  async getById(id) {
    return FooterConfig.findById(id);
  }

  async create(data) {
    return FooterConfig.create(data);
  }

  async update(id, data) {
    return FooterConfig.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id) {
    return FooterConfig.findByIdAndDelete(id);
  }
}

export default new FooterConfigService();