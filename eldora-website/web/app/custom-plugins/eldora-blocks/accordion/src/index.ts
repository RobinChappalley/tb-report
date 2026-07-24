import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { AccordionBlock } from "./types/block";

import Edit from "./components/Edit";
import Save from "./components/Save";
import metadata from "./block.json";

registerBlockType(metadata as BlockConfiguration<AccordionBlock>, {
  edit: Edit,
  save: Save,
});
