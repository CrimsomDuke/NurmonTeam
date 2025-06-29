import React, { useEffect, useState } from "react";
import global_vars from "../../../global/global_vars";
import { type AbilityDataDTO, type ItemDataDTO } from "../../types/types";
import SearchableComboBox from "../shared/SearcheableComboBox";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import { useAuth } from "../../hooks/useAuth";
import CustomComboBox from "../shared/CustomComboBox";


type MemberItemAbilityComponentProps = {
    teamMemberId: number,
    teamId: number,
    nurmonId: number,
    itemId: number,
    selectedAbilityId: number
}

const MemberItemAbilityComponent = (props: MemberItemAbilityComponentProps) => {

    const { getToken } = useAuth();

    const [possibleAbilities, setPossibleAbilities] = useState<AbilityDataDTO[]>([]);

    const [selectedAbilityData, setSelectedAbilityData] = useState<AbilityDataDTO | null>(null);
    const [selectedItemData, setSelectedItemData] = useState<ItemDataDTO | null>(null);

    const [showModalItem, setShowModalItem] = useState(false);
    const handleModalItemClose = () => setShowModalItem(false);
    const handleModalItemShow = () => setShowModalItem(true);

    const [showModalSelectedAbility, setShowModalSelectedAbility] = useState(false);
    const handleModalSelectedAbiltyClose = () => setShowModalSelectedAbility(false);
    const handleModalSelectedAbilityShow = () => setShowModalSelectedAbility(true);

    useEffect(() => {
        if (props.selectedAbilityId) {
            fetchAbilityData(props.selectedAbilityId);
        }

        if (props.itemId) {
            fetchItemData(props.itemId);
        }

        if (props.nurmonId) {
            fetchPossibleAbilities();
        }
    }, [props.teamMemberId, props.itemId, props.selectedAbilityId, props.nurmonId]);

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

    const handleChangeSelectedAbility = async () => {

        if (!selectedAbilityData) {
            alert("Please select an ability.");
            return;
        }

        const body = {
            "team_id": props.teamId,
            "nurmon_id": props.nurmonId,
            "selected_ability_id": selectedAbilityData.id
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
            setSelectedAbilityData(selectedAbilityData);
            handleModalSelectedAbiltyClose();
        } else {
            console.error("Error updating ability:", data);
            alert("Error updating ability: " + (data.data || data.error));
        }
    }

    const handleRemoveAbility = async () => {
        if (!selectedAbilityData) {
            alert("Please select an ability to remove.");
            return;
        }

        const body = {
            "team_id": props.teamId,
            "nurmon_id": props.nurmonId,
            "selected_ability_id": 0 // Le puse a la API que si recibe 0, se mata la ability
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
            setSelectedAbilityData(null);
        } else {
            console.error("Error removing ability:", data);
            alert("Error removing ability: " + (data.data || data.error));
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

    const fetchPossibleAbilities = async () => {
        const response = await fetch(`${global_vars.API_URL}/abilities/nurmon/${props.nurmonId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            setPossibleAbilities(data);
        } else {
            console.error("Error fetching possible abilities:", data.data || data.error);
            alert("Error fetching possible abilities: " + (data.data || data.error));
        }
    }

    return (
        <>
            <div className="container">
                <Row className="gy-4">
                    {/* ITEM CARD */}
                    <Col md={6}>
                        <div className="border rounded p-3 shadow-sm h-100">
                            <h5 className="mb-3">Item</h5>

                            {!selectedItemData ? (
                                <p className="text-muted">No item selected</p>
                            ) : (
                                <>
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <img
                                            src={`${global_vars.UPLOADS_URL}/item/${selectedItemData.image_path}`}
                                            alt={selectedItemData.name}
                                            className="img-thumbnail"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h6 className="mb-1">{selectedItemData.name}</h6>
                                            <small className="text-muted">{selectedItemData.description}</small>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="d-flex justify-content-between mt-3">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handleModalItemShow}
                                >
                                    <PencilFill className="me-1" />
                                    {selectedItemData ? 'Change Item' : 'Pick Item'}
                                </Button>

                                {selectedItemData && (
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={handleRemoveItem}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Col>

                    {/* ABILITY CARD */}
                    <Col md={6}>
                        <div className="border rounded p-3 shadow-sm h-100">
                            <h5 className="mb-3">Ability</h5>

                            {!selectedAbilityData ? (
                                <p className="text-muted">No ability selected</p>
                            ) : (
                                <div>
                                    <h6 className="mb-1">{selectedAbilityData.name}</h6>
                                    <small className="text-muted">{selectedAbilityData.description}</small>
                                </div>
                            )}

                            <div className="d-flex justify-content-between mt-3">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handleModalSelectedAbilityShow}
                                >
                                    <PencilFill className="me-1" />
                                    {selectedAbilityData ? 'Change Ability' : 'Pick Ability'}
                                </Button>

                                {selectedAbilityData && (
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={handleRemoveAbility}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* ITEM MODAL */}
            <Modal show={showModalItem} onHide={handleModalItemClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SearchableComboBox<ItemDataDTO>
                        endpoint={`${global_vars.API_URL}/items/search`}
                        textField="name"
                        valueField="id"
                        folder_name="item"
                        image_field="image_path"
                        placeholder="Select Item"
                        onSelect={(item) => {
                            setSelectedItemData(item);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleChangeItem}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* ABILITY MODAL */}
            <Modal show={showModalSelectedAbility} onHide={handleModalSelectedAbiltyClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select Ability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomComboBox<AbilityDataDTO>
                        dataSource={possibleAbilities}
                        textField="name"
                        valueField="id"
                        selectedValue={selectedAbilityData?.id ?? ''}
                        onChange={(value) => {
                            setSelectedAbilityData(
                                possibleAbilities.find((ability) => ability.id === Number(value)) || null
                            );
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleChangeSelectedAbility}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default MemberItemAbilityComponent;