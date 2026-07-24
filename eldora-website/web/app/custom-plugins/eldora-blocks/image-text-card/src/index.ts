import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { ImageTextCardBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<ImageTextCardBlock>, {
  parent: ["eldora/image-text-card-container"],
  edit: Edit,
  save: Save,
});
