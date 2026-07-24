import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { MediaBlock } from "./types/block";

import metadata from "./block.json";
import Edit from "./components/Edit";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<MediaBlock>, {
  edit: Edit,
  save: Save,
});
