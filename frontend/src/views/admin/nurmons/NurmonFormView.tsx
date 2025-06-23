import { Col, Form, Row } from "react-bootstrap";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import global_vars from "../../../../global/global_vars";
import CustomComboBox from "../../../components/CustomComboBox";
import type { AbilityDataDTO, TypeDataDTO } from "../../../types/types";
import { Link } from "react-router-dom";
import NurmonMovementsFormView from "../../../components/admin/NurmonMovementForm";


const NurmonFormView = () => {

    const params = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [name, setName] = useState('');
    const [nurmonImage, setNurmonImage] = useState<File | string | null>(null);
    const [hp, setHp] = useState<number>(0);
    const [def, setDef] = useState<number>(0);
    const [attack, setAttack] = useState<number>(0);
    const [specialAttack, setSpecialAttack] = useState<number>(0);
    const [specialDefense, setSpecialDefense] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0);
    const [typeId, setTypeId] = useState<number>(0);
    const [firstAbilityId, setFirstAbilityId] = useState<number | null>(null);
    const [secondAbilityId, setSecondAbilityId] = useState<number | null>(null);
    const [thirdAbilityId, setThirdAbilityId] = useState<number | null>(null);

    const [types, setTypes] = useState<TypeDataDTO[]>([]);
    const [abilities, setAbilities] = useState<AbilityDataDTO[]>([]); // Assuming abilities are of TypeDataDTO type

    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchTypes();
        fetchAbilities();
    }, []);

    useEffect(() => {
        if (params.id) {
            fetchNurmonDta();
        }
    }, [params.id]);

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append('name', name);
        formData.append('hp', hp.toString());
        formData.append('def', def.toString());
        formData.append('attack', attack.toString());
        formData.append('special_attack', specialAttack.toString());
        formData.append('special_def', specialDefense.toString());
        formData.append('speed', speed.toString());
        formData.append('type_id', typeId.toString());
        if (firstAbilityId) formData.append('first_ability_id', firstAbilityId.toString());
        if (secondAbilityId) formData.append('second_ability_id', secondAbilityId.toString());
        if (thirdAbilityId) formData.append('third_ability_id', thirdAbilityId.toString());

        if (nurmonImage && typeof nurmonImage !== 'string') {
            formData.append('image', nurmonImage);
        }

        if (params.id){
            await handleUpdate(formData);
        }else{
            await handleCreate(formData)
        }
    }

    const handleUpdate = async (formData : FormData) => {
        if (!validateFormFields()) return;

        try{
            const response = await fetch(`${global_vars.API_URL}/nurmons/update/${params.id}`, {
                method: 'PUT',
                headers : {
                    'Authorization' : `Bearer ${getToken()}`,
                },
                body: formData
            })

            const data = await response.json();
            if(response.ok){
                console.log("Nurmon updated successfully:", data);
                alert("Nurmon updated");
                navigate('/admin/nurmons');
            } else {
                console.error("Failed to update Nurmon:", data);
                setErrorMessage("Failed to update Nurmon. Please try again later.");
            }
        }catch(error){
            console.error("Error updating Nurmon:", error);
            setErrorMessage("Failed to update Nurmon. Please try again later.");    
        }
    }

    const handleCreate = async (formData : FormData) => {

        if (!validateFormFields()) return;

        try{
            const response = await fetch(`${global_vars.API_URL}/nurmons/create`, {
                method: 'POST',
                headers : {
                    'Authorization' : `Bearer ${getToken()}`,
                },
                body: formData
            })

            const data = await response.json();
            if(response.ok){
                console.log("Nurmon created successfully:", data);
                alert("Nurmon created");
                navigate('/admin/nurmons');
            } else {
                console.error("Failed to create Nurmon:", data);
                setErrorMessage("Failed to create Nurmon. Please try again later.");
            }
        }catch(error){
            console.error("Error creating Nurmon:", error);
            setErrorMessage("Failed to create Nurmon. Please try again later.");    
        }
    }

    const handleDelete = async () => {
        if (!params.id) {
            setErrorMessage("Nurmon ID is required for deletion.");
            return;
        }

        try {
            const response = await fetch(`${global_vars.API_URL}/nurmons/delete/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (response.ok) {
                console.log("Nurmon deleted successfully");
                alert("Nurmon deleted successfully");
                navigate('/admin/nurmons');
            } else {
                const data = await response.json();
                console.error("Failed to delete Nurmon:", data);
                setErrorMessage("Failed to delete Nurmon. Please try again later.");
            }
        } catch (error) {
            console.error("Error deleting Nurmon:", error);
            setErrorMessage("Failed to delete Nurmon. Please try again later.");
        }
    }

    const fetchNurmonDta = async () => {
        try{
            const response = await fetch(`${global_vars.API_URL}/nurmons/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json();
            if(response.ok){
                console.log("Nurmon data fetched successfully:", data);
                
                setName(data.name);
                setHp(data.hp);
                setDef(data.def);
                setAttack(data.attack);
                setSpecialAttack(data.special_attack);
                setSpecialDefense(data.special_def);
                setSpeed(data.speed);
                setTypeId(data.type_id);
                setFirstAbilityId(data.first_ability_id);
                setSecondAbilityId(data.second_ability_id);
                setThirdAbilityId(data.third_ability_id);
                setNurmonImage(data.image_path);
        
            } else {
                console.error("Failed to fetch Nurmon data:", data);
            }
        }catch(error){
            console.error("Error fetching Nurmon data:", error);
            setErrorMessage("Failed to fetch Nurmon data. Please try again later.");
        }
    }

    const fetchTypes = async () => {
        try {
            const response = await fetch(`${global_vars.API_URL}/types`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                setTypes(data);
            } else {
                console.error("Failed to fetch types:", data);
                setErrorMessage("Failed to fetch types. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching types:", error);
            setErrorMessage("Failed to fetch types. Please try again later.");
        }
    }

    const fetchAbilities = async () => {
        try {
            const response = await fetch(`${global_vars.API_URL}/abilities`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                setAbilities(data);
            } else {
                console.error("Failed to fetch abilities:", data);
                setErrorMessage("Failed to fetch abilities. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching abilities:", error);
            setErrorMessage("Failed to fetch abilities. Please try again later.");
        }
    }

    const validateFormFields = () => {


        const errorsFields = [];
        if (!name) errorsFields.push("name");
        if (hp < 10) errorsFields.push("hp");
        if (def < 10) errorsFields.push("def");
        if (attack < 10) errorsFields.push("attack");
        if (specialAttack < 10) errorsFields.push("specialAttack");
        if (specialDefense < 10) errorsFields.push("specialDefense");
        if (speed < 10) errorsFields.push("speed");
        if (typeId <= 0) errorsFields.push("type_id");
        if (!nurmonImage) errorsFields.push("nurmonImage");
        
        if( errorsFields.length > 0) {
            setErrorMessage(`Please fill in the following fields: ${errorsFields.join(', ')}`);
            return false;
        } else {
            setErrorMessage('');
            return true;
        }
    }

    return (
        <>
            <AdminNavbar />
            <main className="container m-2 p-2">
                <h1>Nurmon Form</h1>
                <Link to="/admin/nurmons" className="btn btn-secondary mb-3">Back to Nurmons List</Link>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                
                <Form className="m-2 card dark-mode p-2 justify-content-center" onSubmit={handleSubmit}>
                    <Row>
                        <Col md={4} className="card m-3 p-3">
                            <Form.Group>
                                <Form.Label>Nurmon Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter the Nurmon name" className="form-control" 
                                   value={name} onChange={(e) => setName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <CustomComboBox<TypeDataDTO> dataSource={types} textField="name" valueField="id" 
                                    selectedValue={typeId != 0 ?  typeId : ''} onChange={(val) => setTypeId(val as number)}  required/>
                            </Form.Group>
                            {/** Image section */}
                            <Form.Group>
                                <Form.Label>Nurmon Image</Form.Label>
                                <Form.Control type="file" accept="image/*" 
                                    onChange={(e : React.ChangeEvent<HTMLInputElement>) => setNurmonImage(e.target.files ? e.target.files[0] : null)} />
                            </Form.Group>
                            { nurmonImage && typeof nurmonImage === 'string' && (
                                <div className="mt-3">
                                    <img src={global_vars.UPLOADS_URL + "/nurmon/" + nurmonImage} alt="Nurmon" className="img-fluid" />
                                </div>
                            )}

                            {/** Abilities section */}
                        </Col>
                        <Col md={4} className="card m-3 p-3">
                            <Form.Group>
                                <Form.Label>HP</Form.Label>
                                <Form.Control type="number" placeholder="Enter base HP value for the Nurmon" 
                                    value={hp} onChange={(e) => setHp(parseInt(e.target.value))} className="form-control" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Defense</Form.Label>
                                <Form.Control type="number" placeholder="Enter base Defense value for the Nurmon" 
                                    value={def} onChange={(e) => setDef(parseInt(e.target.value))} className="form-control" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Attack</Form.Label>
                                <Form.Control type="number" placeholder="Enter base Attack value for the Nurmon" 
                                    value={attack} onChange={(e) => setAttack(parseInt(e.target.value))} className="form-control" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Special Attack</Form.Label>
                                <Form.Control type="number" placeholder="Enter base Special Attack value for the Nurmon" 
                                    value={specialAttack} onChange={(e) => setSpecialAttack(parseInt(e.target.value))} className="form-control" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Special Defesne</Form.Label>
                                <Form.Control type="number" placeholder="Enter base Special Defense value for the Nurmon" 
                                    value={specialDefense} onChange={(e) => setSpecialDefense(parseInt(e.target.value))} className="form-control" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Speed</Form.Label>
                                <Form.Control type="number" placeholder="Enter base Speed value for the Nurmon" 
                                    value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="form-control" required />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>First Ability</Form.Label>
                                <CustomComboBox<AbilityDataDTO> dataSource={abilities} textField="name" valueField="id" 
                                    selectedValue={firstAbilityId ?? ''} onChange={(val) => setFirstAbilityId(val ? parseInt(val as string) : null)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Second Ability</Form.Label>
                                <CustomComboBox<AbilityDataDTO> dataSource={abilities} textField="name" valueField="id" 
                                    selectedValue={secondAbilityId ?? ''} onChange={(val) => setSecondAbilityId(val ? parseInt(val as string) : null)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Third Ability</Form.Label>
                                <CustomComboBox<AbilityDataDTO> dataSource={abilities} textField="name" valueField="id" 
                                    selectedValue={thirdAbilityId ?? ''} onChange={(val) => setThirdAbilityId(val ? parseInt(val as string) : null)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Group className="m-3 d-flex align-content-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Submit</button>
                        </Form.Group>
                        {params.id && (
                            <Form.Group className="m-3 d-flex align-content-center justify-content-center">
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Nurmon</button>
                            </Form.Group>
                        )}
                    </Row>  
                </Form>
                <Row>
                    <NurmonMovementsFormView nurmonId={parseInt(params.id!)} />
                </Row>
            </main>
        </>
    );
}

export default NurmonFormView;