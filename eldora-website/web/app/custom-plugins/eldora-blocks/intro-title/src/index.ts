import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { IntroTitleBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<IntroTitleBlock>, {
  parent: ["eldora/intro-title-container"],
  edit: Edit,
  save: Save,
});
