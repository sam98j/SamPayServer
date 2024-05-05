import mongoose from 'mongoose';

export default class ConfigDB {
  // database uri
  private uri: string;
  constructor(uri: string) {
    this.uri = uri;
  }
  // excute the database
  run() {
    mongoose
      .connect(this.uri)
      .then(() => console.log('database connected'))
      .catch((err) => console.log(err));
  }
}
