/**
 * BlockNoteEmojiPicker — replaces the default BlockNote emoji picker with
 * the @emoji-mart Picker component.
 *
 * How it works:
 *   - `emojiPicker={false}` on BlockNoteView disables the built-in picker.
 *   - `GridSuggestionMenuController` listens for `:` and manages the floating
 *     menu positioning / open-close lifecycle entirely on its own.
 *   - `gridSuggestionMenuComponent` receives `GridSuggestionMenuProps` and
 *     renders the @emoji-mart Picker directly. We pass `getItems` an async
 *     function that returns an empty array because the Picker owns its own
 *     internal search state — we don't need BlockNote's item filtering.
 *   - `minQueryLength={0}` makes the menu open immediately on `:` without
 *     requiring any additional characters first.
 *   - Emoji insertion is handled via `useBlockNoteEditor()` context so the
 *     cursor position is always respected.
 *
 * Usage (place inside <BlockNoteView> alongside other controllers):
 *   <BlockNoteView editor={editor} emojiPicker={false}>
 *     <BlockNoteEmojiPicker />
 *   </BlockNoteView>
 *
 * @layer Features → blocknote/emoji-picker
 */
import { GridSuggestionMenuController, useBlockNoteEditor } from '@blocknote/react'
import type { GridSuggestionMenuProps, DefaultReactGridSuggestionItem } from '@blocknote/react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

// ── EmojiPickerMenu ───────────────────────────────────────────────────────────
// Rendered by GridSuggestionMenuController inside its own floating container.
// props.onItemClick is called with a synthetic item so the controller handles
// trigger text deletion before our handler inserts the selected emoji.
function EmojiPickerMenu(
  props: GridSuggestionMenuProps<DefaultReactGridSuggestionItem>,
) {
  // Access the BlockNote editor instance from context so we can insert the
  // emoji at the current cursor position.
  const editor = useBlockNoteEditor<any, any, any>()

  const handleSelect = (emoji: { native: string }) => {
    if (!editor) return

    // Call props.onItemClick with a synthetic item so that GridSuggestionMenuController
    // performs its built-in cleanup (deletes the `:query` trigger text, refocuses
    // the editor) BEFORE our onItemClick inserts the emoji. Without this the
    // `:` trigger character is left in the document.
    props.onItemClick?.({
      name: emoji.native,
      icon: <span>{emoji.native}</span>,
      onItemClick: () => {
        editor.insertInlineContent([
          { type: 'text', text: emoji.native },
          ' ',
        ])
      },
    })
  }

  return (
    <Picker
      data={data}
      onEmojiSelect={handleSelect}
      theme="auto"
      previewPosition="none"
      skinTonePosition="none"
    />
  )
}

// ── BlockNoteEmojiPicker ──────────────────────────────────────────────────────

interface BlockNoteEmojiPickerProps {
  /** Grid columns hint passed to GridSuggestionMenuController. Default: 8. */
  columns?: number
}

export function BlockNoteEmojiPicker({ columns = 8 }: BlockNoteEmojiPickerProps) {
  return (
    <GridSuggestionMenuController
      triggerCharacter=":"
      // Empty items — the Picker handles search internally.
      getItems={async (): Promise<DefaultReactGridSuggestionItem[]> => []}
      columns={columns}
      // Open on the very first `:` keystroke without waiting for more chars.
      minQueryLength={0}
      gridSuggestionMenuComponent={EmojiPickerMenu}
    />
  )
}