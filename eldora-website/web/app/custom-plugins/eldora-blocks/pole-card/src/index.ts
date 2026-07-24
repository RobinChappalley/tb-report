import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { PoleCardBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<PoleCardBlock>, {
  parent: ["eldora/pole-card-container"],
  edit: Edit,
  save: Save,
});
