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

        if(props.nurmonId){
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
        if(!selectedAbilityData){
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
                "Authorization" : `Bearer ${getToken()}`
            }
        });

        const data = await response.json();
        if(response.ok){
            setPossibleAbilities(data);
        }else{
            console.error("Error fetching possible abilities:", data.data || data.error);
            alert("Error fetching possible abilities: " + (data.data || data.error));
        }
    }

    return (
        <>
            <div className="d-flex align-items-center">
                <Row className="align-items-center mb-3">
                    <Col md={5} className="m-2 h-100">
                        <h5>Item</h5>
                        {!selectedItemData && (
                            <p className="text-muted">No item selected</p>
                        )}
                        {selectedItemData?.image_path && (
                            <div className="align-items-center gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={`${global_vars.UPLOADS_URL}/item/${selectedItemData.image_path}`}
                                        alt={selectedItemData.name}
                                        className="img-thumbnail"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <h4>{selectedItemData.name}</h4>
                                </div>
                                <div>
                                    <div className="fw-semibold">
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
                                Pick Item
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
                    <Col md={5} className="m-2">
                        <h5>Ability</h5>
                        {!selectedAbilityData && (
                            <p className="text-muted">No ability selected</p>
                        )}
                        {selectedAbilityData && (
                            <div className="d-flex align-items-center gap-3">
                                <div>
                                    <h4>{selectedAbilityData.name}</h4>
                                    <p>{selectedAbilityData.description}</p>
                                </div>
                            </div>
                        )}

                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="mt-2"
                            onClick={handleModalSelectedAbilityShow}
                            style={{ fontSize: '20px' }}
                        >
                            <PencilFill className="me-1" />
                            Pick Ability
                        </Button>
                        {selectedAbilityData && (
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleRemoveAbility}
                                    style={{ fontSize: '20px' }}>
                                    Remove
                                </Button>
                        )}
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

            <Modal show={showModalSelectedAbility} onHide={handleModalSelectedAbiltyClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecte the Ability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomComboBox<AbilityDataDTO> 
                        dataSource={possibleAbilities}
                        textField="name"
                        valueField="id"
                        selectedValue={selectedAbilityData ? selectedAbilityData.id : ''}
                        onChange={(value) => {
                            //me dio flojera hacer otro component 
                            setSelectedAbilityData(possibleAbilities.find(ability => ability.id === Number(value)) || null);
                        }}
                    />
                    <Button className="btn btn-primary m-3" onClick={handleChangeSelectedAbility}>Save</Button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default MemberItemAbilityComponent;