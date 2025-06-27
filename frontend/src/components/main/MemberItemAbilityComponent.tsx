import React, { useEffect, useState } from "react";
import global_vars from "../../../global/global_vars";
import { type AbilityDataDTO, type ItemDataDTO } from "../../types/types";
import SearchableComboBox from "../shared/SearcheableComboBox";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import { useAuth } from "../../hooks/useAuth";


type MemberItemAbilityComponentProps = {
    teamMemberId: number,
    teamId: number,
    nurmonId: number,
    itemId: number,
    selectedAbilityId: number
}

const MemberItemAbilityComponent = (props: MemberItemAbilityComponentProps) => {

    const { getToken } = useAuth();

    const [selectedAbilityData, setSelectedAbilityData] = useState<AbilityDataDTO | null>(null);
    const [selectedItemData, setSelectedItemData] = useState<ItemDataDTO | null>(null);
    const [showModalItem, setShowModalItem] = useState(false);

    const handleModalItemClose = () => setShowModalItem(false);
    const handleModalItemShow = () => setShowModalItem(true);

    useEffect(() => {
        if (props.selectedAbilityId) {
            fetchAbilityData(props.selectedAbilityId);
        }

        if (props.itemId) {
            fetchItemData(props.itemId);
        }
    }, [props.teamMemberId, props.itemId, props.selectedAbilityId]);

    const handleChangeItem = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();

        if (!selectedItemData) {
            alert("Please select an item.");
            return;
        }

        const body = {
            "team_id": props.teamId,
            "nurmon_id": props.nurmonId,
            "item_id": selectedItemData.id
        }

        const response = await fetch(`${global_vars.API_URL}/team_members/update/${props.teamMemberId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data)
            fetchItemData(selectedItemData.id);
            handleModalItemClose();
        } else {
            console.error("Error updating item:", data);
            alert("Error updating item: " + (data.data || data.error));
        }
    }

    const handleRemoveItem = async () => {
        if (!selectedItemData) {
            alert("Please select an item to remove.");
            return;
        }

        const body = {
            "team_id": props.teamId,
            "nurmon_id": props.nurmonId,
            "item_id": 0 // Le puse a la API que si recibe 0, se mata el item
        }

        const response = await fetch(`${global_vars.API_URL}/team_members/update/${props.teamMemberId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data);
            setSelectedItemData(null);
        } else {
            console.error("Error removing item:", data);
            alert("Error removing item: " + (data.data || data.error));
        }
    }

    const fetchAbilityData = async (abilityId: number) => {
        const response = await fetch(`${global_vars.API_URL}/abilities/${abilityId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        if (response.ok) {
            setSelectedAbilityData(data);
        } else {
            console.error("Error fetching ability data:", data);
            alert("Error fetching ability data: " + (data.data || data.error));
        }
        return response.json();
    }

    const fetchItemData = async (itemId: number) => {
        const response = await fetch(`${global_vars.API_URL}/items/${itemId}`);
        const data = await response.json();
        if (response.ok) {
            setSelectedItemData(data);
        } else {
            console.error("Error fetching item data:", data);
            alert("Error fetching item data: " + (data.data || data.error));
        }
    }

    return (
        <>
            <div className="d-flex align-items-center">
                <Row className="align-items-center mb-3">
                    <Col xs="auto">
                        <h5>Item</h5>
                        {!selectedItemData && (
                            <p className="text-muted">No item selected</p>
                        )}
                        {selectedItemData?.image_path && (
                            <div className="d-flex align-items-center gap-3">
                                <img
                                    src={`${global_vars.UPLOADS_URL}/item/${selectedItemData.image_path}`}
                                    alt={selectedItemData.name}
                                    className="img-thumbnail"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <div>
                                    <div className="fw-semibold">
                                        <h4>{selectedItemData.name}</h4>
                                        <p>{selectedItemData.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="mt-2"
                                onClick={handleModalItemShow}
                                style={{ fontSize: '20px' }}
                            >
                                <PencilFill className="me-1" />
                                Pick
                            </Button>

                            {selectedItemData && (
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleRemoveItem}
                                    style={{ fontSize: '20px' }}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            <Modal show={showModalItem} onHide={handleModalItemClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecte the Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SearchableComboBox<ItemDataDTO>
                        endpoint={`${global_vars.API_URL}/items`}
                        textField="name"
                        valueField="id"
                        folder_name="item"
                        image_field="image_path"
                        placeholder="Select Item"
                        onSelect={(item) => {
                            setSelectedItemData(item);
                        }}
                    />
                    <Button className="btn btn-primary m-3" onClick={handleChangeItem}>Save</Button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default MemberItemAbilityComponent;