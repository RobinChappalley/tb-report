import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { ParentCardBlock } from "./types/block";

import metadata from "./block.json";
import Edit from "./components/Edit";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<ParentCardBlock>, {
  parent: ["eldora/parent-card-container"],
  edit: Edit,
  save: Save,
});
