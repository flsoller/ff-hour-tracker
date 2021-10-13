import { Model, DataTypes } from 'sequelize';
import sequelize from 'src/config/db';
import Member from './member.model';

interface OrganizationAttributes {
  id: string;
  name: string;
  description: string;
}

class Organization extends Model<OrganizationAttributes> {}

Organization.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.CHAR(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'organizations',
  },
);

Organization.hasMany(Member, { as: 'members' });

export default Organization;
