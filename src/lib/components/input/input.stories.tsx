import type { Meta, StoryObj } from "@storybook/react";

import { WithLabel as WithLabelComp } from "../with_label/with_label";
import { WithCompare as WithCompareComp } from "../with_compare/with_compare";
import {
    Label,
    Input as InputComp,
    PasswordInput as PasswordComp,
    CompareSelect as CompareSelect,
} from "../";

const meta = {
    title: "s8ly/Input",
    component: InputComp,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof InputComp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: "Enter your name",
    },
};

export const HidePlaceholderOnFocus: Story = {
    args: {
        placeholder: "Enter your name",
        hidePlaceholderOnFocus: true,
    },
};

export const Disabeld: Story = {
    args: {
        placeholder: "Enter your name",
        disabled: true,
    },
};

export const Password: Story = {
    render: () => <PasswordComp />,
};

export const WithLabel = () => {
    return (
        <WithLabelComp Label={<Label>Email</Label>}>
            <InputComp placeholder="mail@example.com" type="email" />
        </WithLabelComp>
    );
};

export const WithCompare = () => {
    return (
        <WithCompareComp Compare={<CompareSelect />}>
            <InputComp placeholder="Price" type="number" />
        </WithCompareComp>
    );
};
