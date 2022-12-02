import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PrescreenerBuilder from "./PrescreenerBuilder";

export default {
  title: "PrescreenerReactLibrary/PrescreenerBuilder",
  component: PrescreenerBuilder,
} as ComponentMeta<typeof PrescreenerBuilder>;

const Template: ComponentStory<typeof PrescreenerBuilder> = (args) => (
  <PrescreenerBuilder {...args} />
);

export const FirstTest = Template.bind({});

FirstTest.args = {
  surveyId: "SID-1032",
  apollo_uri: "http://localhost:4000/graphql",
};
