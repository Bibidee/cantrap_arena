# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json

@gl.contract_interface
class Arena:
    class View:
        def get_challenge(self, challenge_id:u256)->dict: ...
    class Write:
        def notify_funded(self, challenge_id:u256)->None: ...

@gl.evm.contract_interface
class Recipient:
    class View: pass
    class Write: pass

class CantrapVault(gl.Contract):
    arena_address: Address
    vaults: TreeMap[u256,str]
    total_credited: u256
    total_paid: u256

    def __init__(self, arena_address:Address):
        self.arena_address=arena_address; self.total_credited=u256(0); self.total_paid=u256(0)

    @gl.public.write.payable
    def fund_challenge(self,challenge_id:u256)->None:
        c=Arena(self.arena_address).view().get_challenge(challenge_id)
        if gl.message.sender_address!=Address(c['author']) or c['status']!='DRAFT' or gl.message.value!=u256(int(c['bounty'])): raise gl.vm.UserError('exact author funding for draft only')
        if self.vaults.get(challenge_id,'')!='': raise gl.vm.UserError('already funded')
        self.vaults[challenge_id]=json.dumps({'amount':str(gl.message.value),'funded':True,'claimed':False,'refunded':False},sort_keys=True); self.total_credited+=gl.message.value
        Arena(self.arena_address).emit(on='finalized').notify_funded(challenge_id)

    @gl.public.write
    def claim_bounty(self,challenge_id:u256)->None:
        c=Arena(self.arena_address).view().get_challenge(challenge_id); v=json.loads(self.vaults[challenge_id])
        if c['status']!='BROKEN' or gl.message.sender_address!=Address(c['winner']) or v['claimed'] or v['refunded']: raise gl.vm.UserError('only canonical winner may claim once')
        v['claimed']=True; self.vaults[challenge_id]=json.dumps(v,sort_keys=True); amount=u256(int(v['amount'])); self.total_paid+=amount; Recipient(c['winner']).emit_transfer(value=amount)

    @gl.public.write
    def refund_expired(self,challenge_id:u256)->None:
        c=Arena(self.arena_address).view().get_challenge(challenge_id); v=json.loads(self.vaults[challenge_id])
        if c['status']!='EXPIRED' or gl.message.sender_address!=Address(c['author']) or v['claimed'] or v['refunded']: raise gl.vm.UserError('only clean expired challenge may refund once')
        v['refunded']=True; self.vaults[challenge_id]=json.dumps(v,sort_keys=True); amount=u256(int(v['amount'])); self.total_paid+=amount; Recipient(c['author']).emit_transfer(value=amount)

    @gl.public.view
    def get_vault(self,challenge_id:u256)->dict: return json.loads(self.vaults[challenge_id])
    @gl.public.view
    def accounting(self)->dict: return {'credited':self.total_credited,'paid':self.total_paid,'accounted':self.total_credited-self.total_paid}
