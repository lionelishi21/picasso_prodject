const HeaderConfig = require('../models/Components/HeaderConfig');

class HeaderConfigService {
 
    async getByStore(storeId) {
    return HeaderConfig.find({ store: storeId });
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

module.exports = new HeaderConfigService();