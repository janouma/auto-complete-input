<svelte:options immutable={true} />

<script>
  import '../../lib/stylesheet_link.js'
  import debounce from './lib/debounce.js'

  export let stylesheet = './styles/index.css'
  export let addlabel = 'add'
  export let accessibleaddlabel = addlabel
  export let placeholder
  export let options
  export let oninput
  export let threshold
  export let value
  export let onadd

  let addButton
  let list

  const highlightedOptionIndex = { value: 0 }

  $: stylesheetResolvedPath = import.meta.resolve(stylesheet)
  $: addButtonWidth = addButton ? window.getComputedStyle(addButton).width : '0'
  $: addButton?.parentNode.host.style.setProperty('--add-btn-width', addButtonWidth)

  // eslint-disable-next-line no-unused-expressions, no-sequences
  $: options, resetListFocus()

  function dispatchInputValue ({ target: { value: text } }) {
    oninput?.(text.trim())
  }

  const debouncedDispatchInputValue = threshold
    ? debounce(dispatchInputValue, threshold)
    : dispatchInputValue

  function dispatchAddValue () {
    onadd?.(value.trim())
  }

  function getValue (option) {
    return option.value || option
  }

  function getLabel (option) {
    return option.label || option
  }

  function select (option) {
    value = getValue(option)
  }

  function match (option, selected) {
    return (getValue(option) === selected) || undefined
  }

  function highlightOption ({ key }) {
    if (!['ArrowDown', 'ArrowUp'].includes(key) || !list) {
      return
    }

    const previousIndex = highlightedOptionIndex.value

    if (key === 'ArrowDown') {
      highlightedOptionIndex.value = Math.min(previousIndex + 1, options?.length || 0)
    }

    if (key === 'ArrowUp') {
      highlightedOptionIndex.value = Math.max(previousIndex - 1, 0)
    }

    if (highlightedOptionIndex.value > 0 && highlightedOptionIndex.value !== previousIndex) {
      focusListItem(highlightedOptionIndex.value)

      const optionElement = getListItem(previousIndex)
      optionElement?.blur()
      optionElement?.removeAttribute('tabindex')
    }
  }

  function resetListFocus () {
    highlightedOptionIndex.value = 0
  }

  function focusListItem (index) {
    const optionElement = getListItem(index)
    optionElement?.setAttribute('tabindex', 0)
    optionElement?.focus()
  }

  function getListItem (index) {
    return list.querySelector(`:scope > li:nth-child(${index}) > button`)
  }
</script>

<stylesheet-link src={stylesheetResolvedPath} />

<input type="text" bind:value on:keydown={highlightOption} {placeholder}
  on:input={debouncedDispatchInputValue} on:focus={resetListFocus} />

{#if options}
  {#if options.length > 0}
    <ul bind:this={list} on:keydown={highlightOption} role="listbox" tabindex="0">
      {#each options as option (getValue(option))}
        <li
          role="option"
          title={getLabel(option)}
          aria-selected={match(option, value)}
        >
          <button on:click={() => select(option)}>{getLabel(option)}</button>
        </li>
      {/each}
    </ul>
  {:else if value?.trim()}
    <button bind:this={addButton} class="add" on:click={dispatchAddValue} title={accessibleaddlabel}>
      {addlabel}
    </button>
  {/if}
{/if}
