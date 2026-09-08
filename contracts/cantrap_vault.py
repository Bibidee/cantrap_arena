# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""Escrow vault with explicit funding and payout state."""
from genlayer import *
from datetime import datetime,timezone
import json
def _now()->int: return int(datetime.now(timezone.utc).timestamp())
@gl.contract_interface
class Arena:
    class View:
        def get_challenge(self,challenge_id:u256)->dict: ...
    class Write:
        def sync_funding(self,challenge_id:u256)->None: ...
@gl.evm.contract_interface
class Recipient:
    class View: pass
    class Write: pass
class CantrapVault(gl.Contract):
    arena_address:Address
    vaults:TreeMap[u256,str]
    total_credited:u256
    total_dispatched:u256
    def __init__(self,arena_address:Address):
        self.arena_address=arena_address; self.total_credited=u256(0); self.total_dispatched=u256(0)
    @gl.public.write.payable
    def fund_challenge(self,challenge_id:u256)->None:
        c=Arena(self.arena_address).view().get_challenge(challenge_id)
        if gl.message.sender_address!=Address(c['author']) or c['status']!='DRAFT' or gl.message.value!=u256(int(c['bounty'])): raise gl.vm.UserError('exact author funding for draft only')
        if self.vaults.get(challenge_id,'')!='': raise gl.vm.UserError('already funded')
        self.vaults[challenge_id]=json.dumps({'amount':str(gl.message.value),'funded_at':_now(),'state':'FUNDED'},sort_keys=True); self.total_credited+=gl.message.value
        Arena(self.arena_address).emit(on='finalized').sync_funding(challenge_id)
    @gl.public.write
    def retry_notify_funded(self,challenge_id:u256)->None:
        v=json.loads(self.vaults[challenge_id])
        if v['state']!='FUNDED': raise gl.vm.UserError('not funded')
        Arena(self.arena_address).emit(on='finalized').sync_funding(challenge_id)
    def _start_payout(self,challenge_id:u256,recipient:Address,required_status:str,author:bool)->None:
        c=Arena(self.arena_address).view().get_challenge(challenge_id); v=json.loads(self.vaults[challenge_id])
        expected=Address(c['author']) if author else Address(c['winner'])
        if c['status']!=required_status or gl.message.sender_address!=expected or v['state']!='FUNDED': raise gl.vm.UserError('payout not eligible')
        v['state']='TRANSFER_DISPATCHED'; v['recipient']=str(recipient); v['dispatched_at']=_now(); v['transfer_kind']='BOUNTY' if not author else ('EXPIRED_REFUND' if required_status=='EXPIRED' else 'UNACTIVATED_REFUND'); self.vaults[challenge_id]=json.dumps(v,sort_keys=True); self.total_dispatched+=u256(int(v['amount']))
        Recipient(recipient).emit_transfer(value=u256(int(v['amount'])))
    @gl.public.write
    def claim_bounty(self,challenge_id:u256)->None:
        c=Arena(self.arena_address).view().get_challenge(challenge_id); self._start_payout(challenge_id,Address(c['winner']),'BROKEN',False)
    @gl.public.write
    def refund_expired(self,challenge_id:u256)->None:
        c=Arena(self.arena_address).view().get_challenge(challenge_id); self._start_payout(challenge_id,Address(c['author']),'EXPIRED',True)
    @gl.public.write
    def refund_unactivated(self,challenge_id:u256)->None:
        c=Arena(self.arena_address).view().get_challenge(challenge_id); v=json.loads(self.vaults[challenge_id])
        if c['status']!='FUNDED' or gl.message.sender_address!=Address(c['author']) or _now()<int(v['funded_at'])+int(c.get('activation_timeout',86400)) or v['state']!='FUNDED': raise gl.vm.UserError('unactivated refund not eligible')
        v['state']='TRANSFER_DISPATCHED'; v['recipient']=c['author']; v['dispatched_at']=_now(); v['transfer_kind']='UNACTIVATED_REFUND'; self.vaults[challenge_id]=json.dumps(v,sort_keys=True); self.total_dispatched+=u256(int(v['amount'])); Recipient(Address(c['author'])).emit_transfer(value=u256(int(v['amount'])))
    @gl.public.view
    def get_vault(self,challenge_id:u256)->dict: return json.loads(self.vaults[challenge_id])
    @gl.public.view
    def accounting(self)->dict: return {'credited':self.total_credited,'dispatched':self.total_dispatched,'locked':self.total_credited-self.total_dispatched,'accounted':self.total_credited}
