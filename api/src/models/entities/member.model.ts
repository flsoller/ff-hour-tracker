import { Model, DataTypes } from 'sequelize';
import sequelize from 'src/config/db';
import Organization from './organisation.model';

interface MemberAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

class Member extends Model<MemberAttributes> {}

Member.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'members',
  },
);

Member.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

export default Member;
