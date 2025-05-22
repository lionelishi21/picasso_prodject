import HeroSectionConfig from '../models/Components/HeroSectionConfig.js';

class HeroSectionConfigService {
  async getByStore(storeId) {
    return HeroSectionConfig.find({ store: storeId });
  }

  async getById(id) {
    return HeroSectionConfig.findById(id);
  }

  async create(data) {
    return HeroSectionConfig.create(data);
  }

  async update(id, data) {
    return HeroSectionConfig.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id) {
    return HeroSectionConfig.findByIdAndDelete(id);
  }
}

export default new HeroSectionConfigService();