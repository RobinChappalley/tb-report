import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { ImageCarouselStaticBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<ImageCarouselStaticBlock>, {
  edit: Edit,
  save: Save,
});
