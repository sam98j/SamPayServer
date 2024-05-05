import mongoose, { Model } from 'mongoose';
import { Client } from '../interfaces/clients.services';
// create clientSchema
const ClientSchema = new mongoose.Schema<Client, Model<Client>>({
  name: String,
  password: String,
  avatar: String, // photo
  transactionsHistory: [], // transactions that client maked
  account: {
    balance: Number, // client balance
  },
  phone: String, // client phone
  socket_id: String,
  email: {
    required: true,
    type: String,
  },
});
// client model
const ClientModel = mongoose.model('clients', ClientSchema);
// export
export default ClientModel;
