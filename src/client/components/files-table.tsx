import { IconDotsVertical, IconRefresh } from "@intentui/icons"

import { Button } from "./ui/button"
import { Menu } from "./ui/menu"
import { Modal } from "./ui/modal"
import { Table } from "./ui/table"
import { useFileDelete } from "../hooks/useFileDelete"
import { useFileDownload } from "../hooks/useFileDownload"
import { useFiles } from "../hooks/useFiles"
import { useState } from "react"

export const FilesTable = () => {
  const { data: files, error, refetch } = useFiles()
  const downloadFile = useFileDownload()
  const deleteFile = useFileDelete()
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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
      <Button onPress={() => refetch()} className={"self-end"}>
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
                      <Menu.Item
                        isDanger
                        onAction={() => {
                          setFileToDelete(item.key)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Content>
                  </Menu>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Modal isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Confirm Deletion</Modal.Title>
            <Modal.Description>
              Are you sure you want to delete this file? This action cannot be undone.
            </Modal.Description>
          </Modal.Header>

          <Modal.Footer>
            <Button intent="outline" onPress={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              intent="danger"
              onPress={() => {
                if (fileToDelete) {
                  deleteFile.mutate(fileToDelete)
                  setIsDeleteDialogOpen(false)
                  setFileToDelete(null)
                }
              }}
              isDisabled={deleteFile.isPending}
            >
              {deleteFile.isPending ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  )
}
