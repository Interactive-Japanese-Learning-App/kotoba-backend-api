import {
  Schema,
  Document,
} from "mongoose";

export interface INihongo
  extends Document {
  id: number;
  character: string;
  romaji: string;
  meaning: string;
  type: string;
}

const NihongoSchema =
  new Schema<INihongo>(
    {
      id: Number,
      character: String,
      romaji: String,
      meaning: String,
      type: String,
    },
    {
      versionKey: false,
    }
  );

export default NihongoSchema;