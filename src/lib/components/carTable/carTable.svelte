<script lang="ts">
    import { createTable, Render, Subscribe } from "svelte-headless-table";
    import {readable} from "svelte/store";
    import * as Table from "$lib/components/ui/table";

    export let cars: {
        id: number,
        name: string,
        make: string,
        model: string,
    }[];

    const table = createTable(readable(cars));

    const columns = table.createColumns([
        table.column({
            accessor: "name",
            header: "Name"
        }),
        table.column({
            accessor: "make",
            header: "Make"
        }),
        table.column({
            accessor: "model",
            header: "Model"
        }),
        table.column({
            accessor: ({ id }) => id,
            header: "",
        }),
    ]);

    const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                                <Table.Head {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
