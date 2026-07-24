import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { ActionBlock } from "./types/block";

import metadata from "./block.json";
import Edit from "./components/Edit";

registerBlockType(metadata as BlockConfiguration<ActionBlock>, {
  edit: Edit,
  parent: ["eldora/actions-container"],
});
