import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { ImageTextCardContainerBlock } from "./types/block";

import metadata from "./block.json";
import Edit from "./components/Edit";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<ImageTextCardContainerBlock>, {
  edit: Edit,
  save: Save,
});
