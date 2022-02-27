import { ComponentMeta, ComponentStory } from "@storybook/react";
import Sidebar from "../shared/layout/sidebar";

export default {
    title: 'App/Sidebar',
    component: Sidebar,
    parameters: {}
} as ComponentMeta<typeof Sidebar>

const template: ComponentStory<typeof Sidebar> = (args) => <Sidebar showMenu />

export const AppSidebar = template.bind({})