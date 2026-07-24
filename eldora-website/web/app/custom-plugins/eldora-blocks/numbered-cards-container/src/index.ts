import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { NumberedCardsContainerBlock } from "./types/block";

import Edit from "./components/Edit";
import Save from "./components/Save";
import metadata from "./block.json";

registerBlockType(metadata as BlockConfiguration<NumberedCardsContainerBlock>, {
  edit: Edit,
  save: Save,
});
