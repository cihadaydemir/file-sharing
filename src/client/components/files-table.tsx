import { IconDotsVertical, IconRefresh } from "@intentui/icons"

import { Button } from "./ui/button"
import { Menu } from "./ui/menu"
import { Table } from "./ui/table"
import { useFileDownload } from "../hooks/useFileDownload"
import { useFiles } from "../hooks/useFiles"

export const FilesTable = () => {
  const { data: files, error, refetch } = useFiles()
  const downloadFile = useFileDownload()

  console.log("files", files)

  if (error) {
    return (
      <div>
        <p>Something went wrong: {error?.message}</p>
      </div>
    )
  }

  if (!files) {
    return (
      <div>
        <p>No uploaded files.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <Button onPress={() => refetch} className={"self-end"}>
        <IconRefresh />
        Refresh
      </Button>
      <Table aria-label="Products">
        <Table.Header>
          <Table.Column className="w-0">#</Table.Column>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Size</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column />
        </Table.Header>
        <Table.Body items={files.files}>
          {(item) => (
            <Table.Row id={item.key}>
              <Table.Cell>{files.files.indexOf(item)}</Table.Cell>
              <Table.Cell>{item.key}</Table.Cell>
              <Table.Cell>{`${item.size.toLocaleString("de")} kb`}</Table.Cell>
              <Table.Cell>{item.type}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end">
                  <Menu>
                    <Menu.Trigger>
                      <IconDotsVertical />
                    </Menu.Trigger>
                    <Menu.Content aria-label="Actions" placement="left top">
                      <Menu.Item>View</Menu.Item>
                      <Menu.Item
                        onAction={() => {
                          // Create a new instance of the hook for each download
                          downloadFile.mutate(item.key)
                        }}
                      >
                        Download
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item isDanger>Delete</Menu.Item>
                    </Menu.Content>
                  </Menu>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}
