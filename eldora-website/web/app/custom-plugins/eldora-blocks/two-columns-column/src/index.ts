import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { TwoColumnsColumnBlock } from "./types/block";

import Edit from "./components/Edit";
import Save from "./components/Save";
import metadata from "./block.json";

registerBlockType(metadata as BlockConfiguration<TwoColumnsColumnBlock>, {
  parent: ['eldora/two-columns'],
  edit: Edit,
  save: Save,
});
