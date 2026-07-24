import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { NewsCardContainerBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";

registerBlockType(metadata as BlockConfiguration<NewsCardContainerBlock>, {
  edit: Edit,
});
