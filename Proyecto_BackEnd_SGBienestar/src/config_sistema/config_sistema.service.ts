import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigSistema } from './schema/config_sistema.schema';
import { Model, Types } from 'mongoose';
import { CreateConfigSistemaDto, UpdateConfigSistemaDto } from './dto/config_sistema.dto';

@Injectable()
export class ConfigSistemaService {
  constructor(@InjectModel(ConfigSistema.name) private configModel: Model<ConfigSistema>){}

  async create(config: CreateConfigSistemaDto) {
    const found = await this.configModel.find();
    if (found.length > 0) {
        return;
    }
    return await new this.configModel(config).save();
  }

  async findAll() {
    const config = await this.configModel.find();
    return config[0];
  }

  async update(id: string, config: UpdateConfigSistemaDto){
    try {
        const objId = new Types.ObjectId(id);
        return await this.configModel.findByIdAndUpdate({_id: objId}, config, {new:true});
    } catch (error) {
        return;
    }
  }
}
