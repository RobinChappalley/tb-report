import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { HeadingsDescriptionCardBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<HeadingsDescriptionCardBlock>, {
  parent: ["eldora/headings-description-card-container"],
  edit: Edit,
  save: Save,
});
