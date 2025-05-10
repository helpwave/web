## Adding a Story

You can use the `title` to change the displayed _hierarchy_. 
**Make sure** that this _hierarchy_ is the **same as the path** 
in which you have saved the story.

```typescript
const meta = {
  title: 'Category/Folder/ComponentGroup',
  component: Circle,
} satisfies Meta<typeof Circle>

export default meta
type Story = StoryObj<typeof meta>;

export const CircleVariation: Story = {
  args: {
    radius: 40,
    color: 'primary',
    className: '',
  },
}
```
