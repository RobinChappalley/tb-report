import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { NumberedCardBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<NumberedCardBlock>, {
  parent: ["eldora/numbered-cards-container"],
  edit: Edit,
  save: Save,
});
