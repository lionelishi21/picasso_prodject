// services/HeaderConfigService.js
import HeaderConfig from '../models/Components/HeaderConfig.js';

class HeaderConfigService {
 
  async getByStore(storeId) {
    console.log('response', storeId);
    return HeaderConfig.find({ storeId: storeId });
  }

  async getById(id) {
    return HeaderConfig.findById(id);
  }

  async create(data) {
    return HeaderConfig.create(data);
  }

  async update(id, data) {
    return HeaderConfig.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id) {
    return HeaderConfig.findByIdAndDelete(id);
  }
}

export default new HeaderConfigService();
